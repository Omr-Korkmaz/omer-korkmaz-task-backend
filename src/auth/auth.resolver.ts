import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { NewTokensResponse } from './dto/newTokensResponse';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { SignUpInput } from './dto/signup-input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { SignResponse } from './dto/sign-response';
import { LoginInput } from './dto/login-input';
import { LogoutResponse } from './dto/logout-response';
import { Public } from './decorators/public.decorator';
import { CurrentCustomer } from './decorators/currentCustomer.decorator';
import { CurrentCustomerId } from './decorators/currentCustomerId.decorator';
import { ForbiddenException, UseGuards } from '@nestjs/common';
// import { UserRole } from 'src/lib/entities/customer.entity';
import { JwtPayload } from './types';
import { AccessTokenGuard } from './guards/accessToken.guard';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}



  @Mutation(() => SignResponse)
  async signup(
    @Args('signUpInput') signUpInput: SignUpInput,
  ): Promise<SignResponse> {
    return this.authService.signup(signUpInput);
  }

  @Mutation(() => Boolean)
  async verifyAccount(
    @Args('email') email: string,
    @Args('verificationCode') verificationCode: string,
  ): Promise<boolean> {
    return this.authService.verifyAccount(email, verificationCode);
  }

  @Public()
  @Mutation(() => SignResponse)
  login(@Args('loginInput') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  @Query(() => Auth, { name: 'auth' })
  findOne(@Args('id') id: string) {
    return this.authService.findOne(id);
  }

  @Mutation(() => Auth)
  updateAuth(@Args('updateAuthInput') updateAuthInput: UpdateAuthInput) {
    return this.authService.update(updateAuthInput.id, updateAuthInput);
  }

  @Mutation(() => LogoutResponse)
  logout(@Args('id') id: string) {
    return this.authService.logout(id);
  }
  // @UseGuards(AccessTokenGuard)
  @Public()
  @Query(() => String)
  hello() {
    return 'Hello World!';
  }




  @Public()
  @UseGuards(RefreshTokenGuard)
  @Mutation(() => NewTokensResponse)
  getNewTokens(
    @CurrentCustomerId() customerId: string,
    @CurrentCustomer('refreshToken') refreshToken: string,
  ) {
    return this.authService.getNewTokens(customerId, refreshToken);
  }
}
