import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'grouped',
})
export class GroupedPipe implements PipeTransform {
  transform(activities: any[]): any[] {
    if (!activities) return [];

    const arrayLength = Math.ceil(activities.length / 4);

    // Group activities by day, assuming each activity has a 'day' property
    const result = [];
    let currentIndex = 0;

    for (let i = 0; i < arrayLength; i++) {
        const elementsToTake = (i === 0 || i === arrayLength - 1) ? 2 : i % 2 === 0 ? 3 : 4;
        result.push(activities.slice(currentIndex, currentIndex + elementsToTake));
        currentIndex += elementsToTake;
    }

    return result;
  }
}
