import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CatalogoEmpresasPage } from './catalogo-empresas.page';

describe('CatalogoEmpresasPage', () => {
  let component: CatalogoEmpresasPage;
  let fixture: ComponentFixture<CatalogoEmpresasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogoEmpresasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogoEmpresasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
