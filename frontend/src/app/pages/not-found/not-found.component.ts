import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EmptyStateComponent } from '../../shared/ui/empty-state.component';

@Component({
  selector: 'app-not-found',
  imports: [EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-2xl mx-auto px-margin-mobile py-16">
      <app-empty-state icon="sentiment_dissatisfied" title="Oops! This page wandered off" message="The page you're looking for doesn't exist. Let's get you back to the gifts." actionLabel="Back to the shop" actionLink="/shop" />
    </div>
  `,
})
export class NotFoundComponent {}
