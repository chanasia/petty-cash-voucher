import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PettyCashVoucherFormComponent } from './petty-cash-voucher-form.component';

describe('PettyCashVoucherFormComponent', () => {
  let component: PettyCashVoucherFormComponent;
  let fixture: ComponentFixture<PettyCashVoucherFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PettyCashVoucherFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PettyCashVoucherFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
