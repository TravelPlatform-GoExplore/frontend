import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'grouped',
})
export class GroupedNoCutPipe implements PipeTransform {
  transform(activities: any[]): any[] {
    if (!activities) return [];

    // Group activities by day, assuming each activity has a 'day' property
    const result = [activities.slice(0, 2)];
    let currentIndex = 0;

    const restOfDays = activities.slice(2, activities.length - 2);
    const arrayLength = Math.ceil(restOfDays.length / 4);

    for (let i = 0; i < arrayLength; i++) {
        const elementsToTake = (i === 0 || i === arrayLength - 1) ? 2 : i % 2 === 0 ? 3 : 4;
        result.push(restOfDays.slice(currentIndex, currentIndex + elementsToTake));
        currentIndex += elementsToTake;
    }

    result.push(activities.slice(activities.length - 2, activities.length));

    return result;
  }
}
