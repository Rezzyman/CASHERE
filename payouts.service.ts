import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

type Account = { account_id: string; user_id: string; email: string; details_submitted: boolean; payouts_enabled: boolean; };

@Injectable()
export class PayoutsService {
  private stripe: Stripe | null;
  private accounts = new Map<string, Account>();

  constructor() {
    const key = process.env.STRIPE_SECRET_KEY;
    this.stripe = key ? new Stripe(key, { apiVersion: '2024-06-20' }) : null;
  }

  async createOnboardingLink(user_id: string, email: string) {
    if (!this.stripe) {
      const account_id = 'acct_mock_' + Math.random().toString(36).slice(2, 10);
      const acc: Account = { account_id, user_id, email, details_submitted: false, payouts_enabled: false };
      this.accounts.set(user_id, acc);
      return { account_id, onboarding_url: 'https://connect.stripe.com/express/onboarding/mock', mock: true };
    }
    const account = await this.stripe.accounts.create({ type: 'express', email });
    this.accounts.set(user_id, { account_id: account.id, user_id, email, details_submitted: !!account.details_submitted, payouts_enabled: !!account.payouts_enabled });
    const link = await this.stripe.accountLinks.create({
      account: account.id,
      refresh_url: 'https://example.com/reauth',
      return_url: 'https://example.com/return',
      type: 'account_onboarding',
    });
    return { account_id: account.id, onboarding_url: link.url, mock: false };
  }

  async getAccountStatus(user_id: string) {
    const acc = this.accounts.get(user_id);
    if (!acc) return { exists: false };
    if (!this.stripe) return { exists: true, ...acc };
    const a = await this.stripe.accounts.retrieve(acc.account_id);
    const up = { account_id: a.id, user_id, email: acc.email, details_submitted: !!a.details_submitted, payouts_enabled: !!a.payouts_enabled };
    this.accounts.set(user_id, up);
    return { exists: true, ...up };
  }
}
