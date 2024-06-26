import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-session')
  @MessagePattern('create.payment.session')
  createPaymentSession(@Payload() createPaymentDto: CreatePaymentDto) {
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
