import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HavestComponent } from './havest.component';

describe('HavestComponent', () => {
  let component: HavestComponent;
  let fixture: ComponentFixture<HavestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HavestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HavestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
