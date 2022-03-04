import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainFacetComponent } from './main-facet.component';

describe('MainFacetComponent', () => {
  let component: MainFacetComponent;
  let fixture: ComponentFixture<MainFacetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainFacetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainFacetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
