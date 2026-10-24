import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATALOG, cardImage } from '../../core/data/products';
import { formatDate } from '../../core/lib/format';
import { COUPONS } from '../../core/lib/pricing';
import { InventoryService } from '../../core/services/inventory.service';
import { Order, OrdersService, OrderStatus } from '../../core/services/orders.service';
import { ToastService } from '../../core/services/toast.service';
import { IconComponent } from '../../shared/ui/icon.component';
import { InrPipe } from '../../shared/ui/inr.pipe';
import { ModalComponent } from '../../shared/ui/modal.component';

type Period = 'today' | 'week' | 'month';

const NEXT: Record<OrderStatus, { status: OrderStatus; label: string; icon: string } | null> = {
  placed: { status: 'packed', label: 'Mark Packed', icon: 'redeem' },
  packed: { status: 'dispatched', label: 'Mark Dispatched', icon: 'local_shipping' },
  dispatched: { status: 'delivered', label: 'Mark Delivered', icon: 'task_alt' },
  delivered: null,
};

const STATUS_STYLE: Record<OrderStatus, string> = {
  placed: 'bg-amber-100 text-amber-800',
  packed: 'bg-primary-fixed text-primary',
  dispatched: 'bg-secondary-fixed text-secondary',
  delivered: 'bg-emerald-50 text-emerald-700',
};

@Component({
  selector: 'app-admin',
  imports: [RouterLink, IconComponent, InrPipe, ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin.component.html',
})
export class AdminComponent {
  private ordersSvc = inject(OrdersService);
  inventory = inject(InventoryService);
  private toast = inject(ToastService);

  period = signal<Period>('today');
  couponsOpen = signal(false);
  coupons = Object.values(COUPONS);
  image = cardImage;
  when = formatDate;
  next = NEXT;
  statusStyle = STATUS_STYLE;

  private since = computed(() => {
    const d = new Date();
    if (this.period() === 'today') d.setHours(0, 0, 0, 0);
    else d.setDate(d.getDate() - (this.period() === 'week' ? 7 : 30));
    return d.getTime();
  });

  inPeriod = computed(() => this.ordersSvc.orders().filter((o) => new Date(o.createdAt).getTime() >= this.since()));
  revenue = computed(() => this.inPeriod().reduce((s, o) => s + o.totals.grandTotal, 0));
  byStatus = computed(() => {
    const c: Record<OrderStatus, number> = { placed: 0, packed: 0, dispatched: 0, delivered: 0 };
    this.inPeriod().forEach((o) => c[o.status]++);
    return c;
  });
  recent = computed(() => this.ordersSvc.orders().slice(0, 6));
  stockList = computed(() => {
    const s = this.inventory.stock();
    return [...CATALOG].sort((a, b) => (s[a.id] ?? a.stock) - (s[b.id] ?? b.stock)).slice(0, 6);
  });
  lowStock = computed(() => {
    const s = this.inventory.stock();
    return CATALOG.filter((p) => (s[p.id] ?? p.stock) <= 5).length;
  });
  catalogSize = CATALOG.length;

  advance(o: Order) {
    const n = NEXT[o.status];
    if (!n) return;
    this.ordersSvc.setStatus(o.id, n.status);
    this.toast.show({ title: `${o.id} → ${n.status}`, message: 'Customers see this on Track Order.', icon: n.icon });
  }

  printSlip(o: Order) {
    const w = window.open('', '_blank', 'width=420,height=600');
    if (!w) return;
    const rows = o.lines.map((l) => `<tr><td>${l.name}</td><td>× ${l.qty}</td></tr>`).join('');
    w.document.write(
      `<title>${o.id} packing slip</title><body style="font-family:sans-serif;padding:16px"><h2>Lovely Gift Center</h2><p><b>${o.id}</b><br>${o.customer.name}<br>${o.customer.address} ${o.customer.pincode}</p><table>${rows}</table><p>🎁 Gift wrap: yes</p><script>print()<\/script></body>`,
    );
    w.document.close();
  }

  stockOf(id: string) {
    return this.inventory.get(id);
  }

  restock(id: string, n: number) {
    this.inventory.adjust(id, n);
  }

  needsBackend(feature: string) {
    this.toast.show({ title: `${feature} needs a backend`, message: 'Connect a database / CMS to enable this in production.', icon: 'cloud_off', tone: 'error' });
  }

  exportCsv() {
    const header = ['Order ID', 'Date', 'Customer', 'Phone', 'Pincode', 'Delivery', 'Payment', 'Status', 'Items', 'Total'];
    const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
    const rows = this.ordersSvc.orders().map((o) =>
      [o.id, o.createdAt, o.customer.name, o.customer.phone, o.customer.pincode, o.delivery, o.payment, o.status, o.lines.map((l) => `${l.name} x${l.qty}`).join('; '), o.totals.grandTotal]
        .map(esc)
        .join(','),
    );
    const blob = new Blob([[header.map(esc).join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `lgc-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    this.toast.show({ title: 'Orders exported', message: a.download, icon: 'download' });
  }
}
