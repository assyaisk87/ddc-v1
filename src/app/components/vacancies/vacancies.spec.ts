import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vacancies } from './vacancies';

describe('Vacancies', () => {
  let component: Vacancies;
  let fixture: ComponentFixture<Vacancies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vacancies],
    }).compileComponents();

    fixture = TestBed.createComponent(Vacancies);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
