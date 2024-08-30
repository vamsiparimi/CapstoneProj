import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing'; // Import RouterTestingModule
import { NavComponent } from './nav.component';
import { AuthService } from '../../services/auth.service'; // Adjust the path as needed

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule, // Include HttpClientModule here
        RouterTestingModule, // Include RouterTestingModule here
        NavComponent // Import the standalone NavComponent here
      ],
      providers: [
        AuthService // Provide AuthService if used in the component
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
