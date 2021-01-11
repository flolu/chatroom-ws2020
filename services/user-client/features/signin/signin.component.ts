import {Component} from '@angular/core'
import {FormControl, FormGroup, Validators} from '@angular/forms'

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

  signIn() {
    if (this.form.valid) console.log('sign in')
  }
}
