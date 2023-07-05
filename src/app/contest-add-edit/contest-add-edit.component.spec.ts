import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestAddEditComponent } from './contest-add-edit.component';

describe('ContestAddEditComponent', () => {
  let component: ContestAddEditComponent;
  let fixture: ComponentFixture<ContestAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContestAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
