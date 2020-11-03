import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CatsecundariasPage } from './catsecundarias.page';

describe('CatsecundariasPage', () => {
  let component: CatsecundariasPage;
  let fixture: ComponentFixture<CatsecundariasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatsecundariasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CatsecundariasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
