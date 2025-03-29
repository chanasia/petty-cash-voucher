import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PettyCashItemsComponent } from './petty-cash-items.component';

describe('PettyCashItemsComponent', () => {
  let component: PettyCashItemsComponent;
  let fixture: ComponentFixture<PettyCashItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PettyCashItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PettyCashItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
