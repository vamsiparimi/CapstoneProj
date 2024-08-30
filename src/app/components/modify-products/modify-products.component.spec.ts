import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { ModifyProductsComponent } from './modify-products.component';
import { ProductService } from '../../services/product.service'; // Adjust the path as needed

describe('ModifyProductsComponent', () => {
  let component: ModifyProductsComponent;
  let fixture: ComponentFixture<ModifyProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule, // Include HttpClientModule here
        ModifyProductsComponent // Import the standalone ModifyProductsComponent here
      ],
      providers: [
        ProductService // Provide ProductService if used in the component
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
