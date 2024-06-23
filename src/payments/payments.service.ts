import { Inject, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { envs } from '../config/envs';
import Stripe from 'stripe';
import {Request, Response} from 'express';
import { NATS_SERVICE } from '../config/services';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PaymentsService {

  private readonly stripe = new Stripe(envs.stripe_secret)

  constructor(
    @Inject(NATS_SERVICE) private readonly client:ClientProxy
  ){}

  async createPaymentSession(createPaymentDto: CreatePaymentDto) {

    const {currency, items, orderId}= createPaymentDto

    const lineItems=items.map(item=>{
      return {
        price_data:{
          currency,
          product_data:{
            name:item.name,
          },
          unit_amount:Math.round(item.price*100)
        },
        quantity:item.quantity
      }
    })

    const session = await this.stripe.checkout.sessions.create({
      //order ID in here
      payment_intent_data:{
        metadata:{
          orderId:orderId
        }
      },
      line_items:lineItems,
      mode:'payment',
      success_url:envs.stripe_success_url,
      cancel_url:envs.stripe_cancel_url
    })

    return {
      cancelUrl:session.cancel_url,
      successUrl:session.success_url,
      url:session.url
    }
  }

  async stripeWebhook(req , res){
    const sig= req.headers['stripe-signature']
    let event: Stripe.Event;

    const endpointSecret=envs.stripe_endpoint_secret

    try {
      event=this.stripe.webhooks.constructEvent(
        req['rawBody'],
        sig,
        endpointSecret
      )
    } catch (error) {
      res.status(400).send(`Webhook Error: ${error.message}`)
      return
    }
    switch(event.type){
      case 'charge.succeeded':
        const chargeSucceded=event.data.object;
        const payload= {
          stripePaymentId: chargeSucceded.id,
          orderId:chargeSucceded.metadata.orderId,
          receiptUrl:chargeSucceded.receipt_url
        }
        //Call MS
       this.client.emit('payment.succeeded',payload)
      break;
      default:
        console.log(`Event ${event.type} not handled`)
    }
  }

}
