import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-session')
  createPaymentSession(@Body() createPaymentDto: CreatePaymentDto) {
   return this.paymentsService.createPaymentSession(createPaymentDto);
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
  async stripeWebhook(@Req() req: Request, @Res() res: Response) {
   return this.paymentsService.stripeWebhook(req,res);
  }

}
