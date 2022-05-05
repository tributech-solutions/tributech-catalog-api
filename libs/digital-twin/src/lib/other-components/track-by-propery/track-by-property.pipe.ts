import { Pipe, PipeTransform, TrackByFunction } from '@angular/core';
// Based on https://www.bennadel.com/blog/3579-using-pure-pipes-to-generate-ngfor-trackby-identity-functions-in-angular-7-2-7.htm
interface TrackByFunctionCache {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [propertyName: string]: <T>(index: number, item: T) => string | number;
}

// Since the resultant TrackBy functions are based purely on a static property name, we
// can cache these Functions across the entire app. No need to generate more than one
// Function for the same property.
const cache: TrackByFunctionCache = Object.create(null);

@Pipe({
  name: 'trackByProperty',
  pure: true,
})
export class TrackByPropertyPipe implements PipeTransform {
  // I return a TrackBy function that plucks the given property from the ngFor item.
  // eslint-disable-next-line @typescript-eslint/ban-types
  public transform<T>(propertyName: string): TrackByFunction<T> {
    // Ensure cached function exists.
    if (!cache[propertyName]) {
      cache[propertyName] = function trackByProperty<T>(
        index: number,
        item: T
      ): string | number {
        return item[propertyName];
      };
    }
    return cache[propertyName];
  }
}
