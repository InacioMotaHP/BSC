import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CatprimariasPage } from './catprimarias.page';

describe('CatprimariasPage', () => {
  let component: CatprimariasPage;
  let fixture: ComponentFixture<CatprimariasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatprimariasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CatprimariasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
