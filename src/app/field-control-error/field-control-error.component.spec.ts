import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldControlErrorComponent } from './field-control-error.component';

describe('FieldControlErrorComponent', () => {
  let component: FieldControlErrorComponent;
  let fixture: ComponentFixture<FieldControlErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldControlErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldControlErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
