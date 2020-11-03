import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetalhesProdutoPage } from './detalhes-produto.page';

describe('DetalhesProdutoPage', () => {
  let component: DetalhesProdutoPage;
  let fixture: ComponentFixture<DetalhesProdutoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalhesProdutoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetalhesProdutoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
