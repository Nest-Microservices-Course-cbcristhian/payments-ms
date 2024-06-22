import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { envs } from '../config/envs';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {

  private readonly stripe = new Stripe(envs.stripe_secret)
  async createPaymentSession(createPaymentDto: CreatePaymentDto) {

    const {currency, items}= createPaymentDto

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

      },
      line_items:lineItems,
      mode:'payment',
      success_url:'http://localhost:3003/payments/success',
      cancel_url:'http://localhost:3003/payments/cancel'
    })

    return session
  }

  findAll() {
    return `This action returns all payments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
