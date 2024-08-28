import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent {
  helpForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.helpForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.helpForm.valid) {
      console.log('Form Submitted', this.helpForm.value);
      // Handle form submission, e.g., send to a server or display a success message.
    } else {
      console.log('Form is invalid');
      // Display an error message or highlight invalid fields.
    }
  }
}
