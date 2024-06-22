import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-session')
  createPaymentSession(@Body() createPaymentDto: CreatePaymentDto) {
   return this.paymentsService.create(createPaymentDto);
  }

  @Get('success')
  success() {
    return {message:'Payment succesful'}
  }

  @Get('cancel')
  cancel() {
    return {message:'Payment cancelled'}
  }

  @Post('webhook')
  stripeWebhook(@Body() createPaymentDto: CreatePaymentDto) {
   return this.paymentsService.create(createPaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(+id);
  }
}
