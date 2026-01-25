import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const transactions = [
  { id: '1', customer: 'John Smith', email: 'john@example.com', amount: '$250.00', status: 'completed', date: 'Jan 11, 2026' },
  { id: '2', customer: 'Emma Wilson', email: 'emma@example.com', amount: '$150.00', status: 'pending', date: 'Jan 10, 2026' },
  { id: '3', customer: 'Michael Brown', email: 'michael@example.com', amount: '$350.00', status: 'completed', date: 'Jan 10, 2026' },
  { id: '4', customer: 'Sarah Davis', email: 'sarah@example.com', amount: '$450.00', status: 'failed', date: 'Jan 09, 2026' },
  { id: '5', customer: 'James Miller', email: 'james@example.com', amount: '$550.00', status: 'completed', date: 'Jan 09, 2026' },
];

const statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  completed: 'default',
  pending: 'secondary',
  failed: 'destructive',
};

export function RecentTransactionsTable() {
  return (
    <div className="bg-card rounded-xl border border-border shadow-soft overflow-hidden">
      <div className="p-5 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
        <p className="text-sm text-muted-foreground mt-1">Latest payment activities</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-start px-5 py-3 text-sm font-medium text-muted-foreground">Customer</th>
              <th className="text-start px-5 py-3 text-sm font-medium text-muted-foreground">Amount</th>
              <th className="text-start px-5 py-3 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-start px-5 py-3 text-sm font-medium text-muted-foreground">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {tx.customer.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{tx.customer}</p>
                      <p className="text-sm text-muted-foreground">{tx.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 font-medium text-foreground">{tx.amount}</td>
                <td className="px-5 py-4">
                  <Badge variant={statusVariants[tx.status]} className="capitalize">
                    {tx.status}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-muted-foreground">{tx.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
