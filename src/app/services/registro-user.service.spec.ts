import { TestBed } from '@angular/core/testing';

import { RegistroUserService } from './registro-user.service';

describe('RegistroUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RegistroUserService = TestBed.get(RegistroUserService);
    expect(service).toBeTruthy();
  });
});
