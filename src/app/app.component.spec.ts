import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { RouterTestingModule } from '@angular/router/testing'; // Import RouterTestingModule
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service'; // Adjust the path as needed

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule, // Include HttpClientModule here
        RouterTestingModule, // Include RouterTestingModule here
        AppComponent // Import the standalone AppComponent here
      ],
      providers: [
        AuthService // Provide AuthService if used in the component
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
