import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http'; 
import { ModifyProductsComponent } from './modify-products.component';
import { ProductService } from '../../services/product.service';

describe('ModifyProductsComponent', () => {
  let component: ModifyProductsComponent;
  let fixture: ComponentFixture<ModifyProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule, 
        ModifyProductsComponent
      ],
      providers: [
        ProductService 
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
