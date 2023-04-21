import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { RestService } from './rest.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('RestService', () => {
  let service: jasmine.SpyObj<RestService>;
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule, RouterTestingModule ]
  }));

  beforeEach(() => {
    service = TestBed.get(RestService)
  })

  it('should be created', () => {
    const service: RestService = TestBed.get(RestService);
    expect(service).toBeTruthy();
  });
});
