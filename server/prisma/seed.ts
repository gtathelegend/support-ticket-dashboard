import { PrismaClient, Priority, Status } from '@prisma/client';

const prisma = new PrismaClient();

interface SeedTicket {
  id: string;
  title: string;
  description: string;
  customerEmail: string;
  priority: Priority;
  status: Status;
  daysAgoCreated: number;
  daysAgoUpdated: number;
}

const seedTickets: SeedTicket[] = [
  // 1. Billing
  {
    id: '00000000-0000-4000-a000-000000000001',
    title: 'Duplicate charge on monthly subscription invoice',
    description: 'Customer was billed twice for invoice #INV-2026-0901 on September 15. Requesting refund for duplicate $49.00 charge.',
    customerEmail: 'alex.morgan@techcorp.io',
    priority: Priority.HIGH,
    status: Status.OPEN,
    daysAgoCreated: 28,
    daysAgoUpdated: 28,
  },
  {
    id: '00000000-0000-4000-a000-000000000002',
    title: 'VAT registration number missing on generated PDF invoice',
    description: 'EU corporate customer requires VAT number EU123456789 printed on all monthly invoices for tax compliance.',
    customerEmail: 'finance@acme-solutions.eu',
    priority: Priority.MEDIUM,
    status: Status.IN_PROGRESS,
    daysAgoCreated: 25,
    daysAgoUpdated: 10,
  },

  // 2. Account Access
  {
    id: '00000000-0000-4000-a000-000000000003',
    title: 'Admin account locked after 2FA device replacement',
    description: 'System admin lost access to Google Authenticator app after upgrading phone. Needs backup codes or manual 2FA reset.',
    customerEmail: 'devops-lead@enterprise.com',
    priority: Priority.HIGH,
    status: Status.OPEN,
    daysAgoCreated: 24,
    daysAgoUpdated: 24,
  },
  {
    id: '00000000-0000-4000-a000-000000000004',
    title: 'Unable to invite new team members to organization workspace',
    description: 'Workspace owner gets "Role permissions missing" error when inviting users with Manager permission.',
    customerEmail: 'sarah.connor@cyberdyne.net',
    priority: Priority.MEDIUM,
    status: Status.RESOLVED,
    daysAgoCreated: 23,
    daysAgoUpdated: 5,
  },

  // 3. Login Problems
  {
    id: '00000000-0000-4000-a000-000000000005',
    title: 'SSO SAML login redirection loop on Okta integration',
    description: 'Employees logging in via Okta SAML 2.0 get redirected back to login page repeatedly without session cookie set.',
    customerEmail: 'it-security@globaltech.com',
    priority: Priority.HIGH,
    status: Status.IN_PROGRESS,
    daysAgoCreated: 22,
    daysAgoUpdated: 2,
  },
  {
    id: '00000000-0000-4000-a000-000000000006',
    title: 'Password reset link email not arriving in inbox',
    description: 'Customer requested password reset email three times but received no email in primary inbox or spam folder.',
    customerEmail: 'david.miller@freelance.org',
    priority: Priority.LOW,
    status: Status.OPEN,
    daysAgoCreated: 21,
    daysAgoUpdated: 21,
  },

  // 4. Technical Issues
  {
    id: '00000000-0000-4000-a000-000000000007',
    title: 'CSV export failing with 504 Gateway Timeout on large datasets',
    description: 'Exporting ticket logs containing >50,000 rows causes nginx proxy timeout after 60 seconds.',
    customerEmail: 'data-ops@analytics.co',
    priority: Priority.HIGH,
    status: Status.OPEN,
    daysAgoCreated: 20,
    daysAgoUpdated: 20,
  },
  {
    id: '00000000-0000-4000-a000-000000000008',
    title: 'High latency observed on API search endpoint during peak hours',
    description: 'Average search response time spiked to 3.2s between 14:00-16:00 UTC. Suspect unindexed text column query.',
    customerEmail: 'backend-team@cloudscale.io',
    priority: Priority.MEDIUM,
    status: Status.IN_PROGRESS,
    daysAgoCreated: 19,
    daysAgoUpdated: 4,
  },

  // 5. Payment Failures
  {
    id: '00000000-0000-4000-a000-000000000009',
    title: 'Credit card payment declined for annual renewal',
    description: 'Stripe webhook returned code card_declined for Visa ending in 4242 during automated tier renewal.',
    customerEmail: 'billing@designhub.studio',
    priority: Priority.HIGH,
    status: Status.OPEN,
    daysAgoCreated: 18,
    daysAgoUpdated: 18,
  },
  {
    id: '00000000-0000-4000-a000-000000000010',
    title: 'SEPA Direct Debit mandate verification failed',
    description: 'Customer bank rejected IBAN validation due to bank code mismatch in German SEPA clearing house.',
    customerEmail: 'klaus.weber@berlin-tech.de',
    priority: Priority.LOW,
    status: Status.RESOLVED,
    daysAgoCreated: 17,
    daysAgoUpdated: 8,
  },

  // 6. Subscription Issues
  {
    id: '00000000-0000-4000-a000-000000000011',
    title: 'Downgrade from Enterprise to Pro tier not reflecting seat limits',
    description: 'Account downgraded on Sept 1st still shows 50 allocated seat licenses instead of pro cap of 15.',
    customerEmail: 'operations@scaleup.com',
    priority: Priority.MEDIUM,
    status: Status.IN_PROGRESS,
    daysAgoCreated: 16,
    daysAgoUpdated: 6,
  },
  {
    id: '00000000-0000-4000-a000-000000000012',
    title: 'Prorated credit balance missing after plan upgrade',
    description: 'Upgraded mid-cycle from Starter to Pro but previous 14 unused days credit ($18.50) was not applied to balance.',
    customerEmail: 'claire.bennett@growthlabs.io',
    priority: Priority.LOW,
    status: Status.RESOLVED,
    daysAgoCreated: 15,
    daysAgoUpdated: 12,
  },

  // 7. Feature Requests
  {
    id: '00000000-0000-4000-a000-000000000013',
    title: 'Request for webhook event triggers on ticket priority changes',
    description: 'Customer engineering team needs webhook event ticket.priority_updated to alert PagerDuty on emergency escalations.',
    customerEmail: 'integrations@incident-io.com',
    priority: Priority.LOW,
    status: Status.OPEN,
    daysAgoCreated: 14,
    daysAgoUpdated: 14,
  },
  {
    id: '00000000-0000-4000-a000-000000000014',
    title: 'Add dark mode theme support for operational dashboard',
    description: 'Support center agents monitoring dashboard on night shifts request system dark theme toggle.',
    customerEmail: 'noc-manager@telecom-corp.com',
    priority: Priority.LOW,
    status: Status.OPEN,
    daysAgoCreated: 13,
    daysAgoUpdated: 13,
  },

  // 8. Notification Problems
  {
    id: '00000000-0000-4000-a000-000000000015',
    title: 'Slack integration bot stopped posting notification updates',
    description: 'Slack channel #support-alerts stopped receiving webhooks after Slack workspace OAuth token expired.',
    customerEmail: 'community@dev-network.org',
    priority: Priority.HIGH,
    status: Status.IN_PROGRESS,
    daysAgoCreated: 12,
    daysAgoUpdated: 1,
  },
  {
    id: '00000000-0000-4000-a000-000000000016',
    title: 'Duplicate email alerts sent for single status change',
    description: 'When ticket status is marked In Progress, assigned agent receives two identical email notifications within 3 seconds.',
    customerEmail: 'support-lead@helpdesk.co',
    priority: Priority.MEDIUM,
    status: Status.RESOLVED,
    daysAgoCreated: 11,
    daysAgoUpdated: 7,
  },

  // 9. API / Integration Problems
  {
    id: '00000000-0000-4000-a000-000000000017',
    title: 'REST API returning 401 Unauthorized with valid API token',
    description: 'Bearer token created in settings page fails authentication on GET /api/v1/tickets endpoint.',
    customerEmail: 'developer@partner-api.com',
    priority: Priority.HIGH,
    status: Status.OPEN,
    daysAgoCreated: 10,
    daysAgoUpdated: 10,
  },
  {
    id: '00000000-0000-4000-a000-000000000018',
    title: 'Zendesk ticket sync connector failing on custom fields mapping',
    description: 'Automated integration fails with error "Field custom_priority mapping type mismatch string vs enum".',
    customerEmail: 'crm-admin@enterprise-group.com',
    priority: Priority.MEDIUM,
    status: Status.IN_PROGRESS,
    daysAgoCreated: 9,
    daysAgoUpdated: 3,
  },

  // 10. Dashboard Issues
  {
    id: '00000000-0000-4000-a000-000000000019',
    title: 'Pagination controls glitch when filtering by status RESOLVED',
    description: 'Clicking page 2 while status filter is set to RESOLVED resets page count back to page 1.',
    customerEmail: 'qa-lead@software-house.io',
    priority: Priority.MEDIUM,
    status: Status.OPEN,
    daysAgoCreated: 8,
    daysAgoUpdated: 8,
  },
  {
    id: '00000000-0000-4000-a000-000000000020',
    title: 'Ticket summary counts do not update after bulk status change',
    description: 'Total counter displays stale total until browser hard refresh.',
    customerEmail: 'alex.t@support-team.com',
    priority: Priority.MEDIUM,
    status: Status.IN_PROGRESS,
    daysAgoCreated: 7,
    daysAgoUpdated: 2,
  },

  // Additional 8 tickets across categories for rich 28-item dataset
  {
    id: '00000000-0000-4000-a000-000000000021',
    title: 'Incorrect currency symbol displayed on AUD invoices',
    description: 'Australian dollar amounts display USD symbol ($) instead of A$ on summary reports.',
    customerEmail: 'accounts@sydney-tech.au',
    priority: Priority.LOW,
    status: Status.RESOLVED,
    daysAgoCreated: 6,
    daysAgoUpdated: 4,
  },
  {
    id: '00000000-0000-4000-a000-000000000022',
    title: 'Session timeout occurs while drafting long ticket description',
    description: 'User spent 20 minutes writing detailed bug report and lost draft when submitting due to silent auth expiry.',
    customerEmail: 'reporter@user-feedback.org',
    priority: Priority.MEDIUM,
    status: Status.OPEN,
    daysAgoCreated: 5,
    daysAgoUpdated: 5,
  },
  {
    id: '00000000-0000-4000-a000-000000000023',
    title: 'Mobile dashboard layout breaks on screen width below 375px',
    description: 'Status filter dropdown overlaps with search bar on iPhone SE viewport width.',
    customerEmail: 'ux-tester@mobile-apps.com',
    priority: Priority.MEDIUM,
    status: Status.IN_PROGRESS,
    daysAgoCreated: 4,
    daysAgoUpdated: 1,
  },
  {
    id: '00000000-0000-4000-a000-000000000024',
    title: 'Export to PDF truncates long ticket description text',
    description: 'PDF report cuts off text after 500 characters in description block without page wrap.',
    customerEmail: 'legal@compliance-docs.com',
    priority: Priority.LOW,
    status: Status.RESOLVED,
    daysAgoCreated: 3,
    daysAgoUpdated: 1,
  },
  {
    id: '00000000-0000-4000-a000-000000000025',
    title: 'API rate limiting header missing X-RateLimit-Remaining',
    description: 'Developers cannot track API usage budget because standard response header is omitted.',
    customerEmail: 'dev-rel@api-clients.io',
    priority: Priority.LOW,
    status: Status.OPEN,
    daysAgoCreated: 2,
    daysAgoUpdated: 2,
  },
  {
    id: '00000000-0000-4000-a000-000000000026',
    title: 'Webhooks failing signature verification on HMAC SHA-256',
    description: 'Receiving server rejects webhook signature payload due to header encoding mismatch.',
    customerEmail: 'sec-ops@fintech-pay.com',
    priority: Priority.HIGH,
    status: Status.IN_PROGRESS,
    daysAgoCreated: 2,
    daysAgoUpdated: 1,
  },
  {
    id: '00000000-0000-4000-a000-000000000027',
    title: 'Audit log missing entries for status changes made via API',
    description: 'Modifying ticket status via PATCH endpoint does not generate compliance audit trail event.',
    customerEmail: 'auditor@governance-corp.com',
    priority: Priority.MEDIUM,
    status: Status.OPEN,
    daysAgoCreated: 1,
    daysAgoUpdated: 1,
  },
  {
    id: '00000000-0000-4000-a000-000000000028',
    title: 'Customer name missing in ticket resolution confirmation email',
    description: 'Automated resolution notification renders "Dear {{customer_name}}" placeholder instead of customer name.',
    customerEmail: 'customer-success@saas-app.com',
    priority: Priority.LOW,
    status: Status.RESOLVED,
    daysAgoCreated: 1,
    daysAgoUpdated: 0.5,
  },
];

async function main() {
  console.log('🌱 Starting database seed with deterministic 28 support tickets...');

  // Reset table to clean state before seeding deterministic records
  await prisma.ticket.deleteMany();

  const now = Date.now();
  const ONE_DAY = 24 * 60 * 60 * 1000;

  for (const item of seedTickets) {
    const createdAt = new Date(now - item.daysAgoCreated * ONE_DAY);
    const updatedAt = new Date(now - item.daysAgoUpdated * ONE_DAY);

    await prisma.ticket.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        description: item.description,
        customerEmail: item.customerEmail,
        priority: item.priority,
        status: item.status,
        createdAt,
        updatedAt,
      },
      create: {
        id: item.id,
        title: item.title,
        description: item.description,
        customerEmail: item.customerEmail,
        priority: item.priority,
        status: item.status,
        createdAt,
        updatedAt,
      },
    });
  }

  const count = await prisma.ticket.count();
  console.log(`✅ Database seed completed successfully. Total tickets in database: ${count}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.dbNull;
    await prisma.$disconnect();
  });
