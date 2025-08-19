import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AppService,
        { provide: Router, useValue: routerSpy }
      ]
    });
    service = TestBed.inject(AppService);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('goTo', () => {
    it('should navigate to shipments list', () => {
      service.goTo(['shipments']);

      expect(router.navigate).toHaveBeenCalledWith(['shipments']);
    });

    it('should navigate to shipment detail', () => {
      service.goTo(['shipments', '1']);

      expect(router.navigate).toHaveBeenCalledWith(['shipments', '1']);
    });

    it('should navigate to home', () => {
      service.goTo(['']);

      expect(router.navigate).toHaveBeenCalledWith(['']);
    });

    it('should handle complex navigation paths', () => {
      service.goTo(['shipments', '1', 'calculations', '2']);

      expect(router.navigate).toHaveBeenCalledWith(['shipments', '1', 'calculations', '2']);
    });

    it('should handle empty path array', () => {
      service.goTo([]);

      expect(router.navigate).toHaveBeenCalledWith([]);
    });

    it('should handle single element path', () => {
      service.goTo(['home']);

      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });

    it('should handle multiple calls', () => {
      service.goTo(['shipments']);
      service.goTo(['shipments', '1']);
      service.goTo(['home']);

      expect(router.navigate).toHaveBeenCalledTimes(3);
      expect(router.navigate).toHaveBeenCalledWith(['shipments']);
      expect(router.navigate).toHaveBeenCalledWith(['shipments', '1']);
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
  });

  describe('edge cases', () => {
    it('should handle null path array', () => {
      service.goTo(null as any);

      expect(router.navigate).toHaveBeenCalledWith(null);
    });

    it('should handle undefined path array', () => {
      service.goTo(undefined as any);

      expect(router.navigate).toHaveBeenCalledWith(undefined);
    });

    it('should handle path with special characters', () => {
      service.goTo(['shipments', 'special-route', 'with_underscores']);

      expect(router.navigate).toHaveBeenCalledWith(['shipments', 'special-route', 'with_underscores']);
    });

    it('should handle path with numbers', () => {
      service.goTo(['shipments', 1, 'calculations', 2]);

      expect(router.navigate).toHaveBeenCalledWith(['shipments', 1, 'calculations', 2]);
    });

    it('should handle very long path', () => {
      const longPath = Array.from({ length: 10 }, (_, i) => `segment${i}`);
      service.goTo(longPath);

      expect(router.navigate).toHaveBeenCalledWith(longPath);
    });
  });
});
