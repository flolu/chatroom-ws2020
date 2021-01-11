import {Component} from '@angular/core'
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {Store} from '@ngrx/store'

import {AuthActions} from '@store'

@Component({
  selector: 'app-signin',
  template: `
    <h2>Sgin In</h2>
    <form [formGroup]="form" (submit)="signIn()">
      <input formControlName="username" placeholder="Username" />
      <br />
      <input formControlName="password" type="password" placeholder="Password" />
      <br />
      <button>Sign in</button>
    </form>
  `,
  styleUrls: ['signin.component.sass'],
})
export class SigninComponent {
  form = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  })

  constructor(private store: Store) {}

  signIn() {
    if (this.form.valid) {
      const {username, password} = this.form.value
      this.store.dispatch(AuthActions.signIn({username, password}))
    }
  }
}
