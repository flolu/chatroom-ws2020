import {Component} from '@angular/core'
import {Store} from '@ngrx/store'
import {LogsSelectors} from '@store'

@Component({
  selector: 'app-logs',
  template: `
    <div class="container">
      <table>
        <tr>
          <th class="sticky_header">Type</th>
          <th class="sticky_header">Timestamp</th>
          <th class="sticky_header">Payload</th>
        </tr>
        <tr *ngFor="let log of (logs$ | async).slice().reverse()">
          <td class="type">{{ log.data.type }}</td>
          <td class="time">{{ log.timestamp | date: 'mediumTime' }}</td>
          <td class="payload">{{ log.data.payload | json }}</td>
        </tr>
      </table>
    </div>
  `,
  styleUrls: ['logs.component.sass'],
})
export class LogsComponent {
  logs$ = this.store.select(LogsSelectors.all)

  constructor(private store: Store) {}
}
