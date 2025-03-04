import { Component } from '@angular/core';
import Lottie, { AnimationItem } from 'lottie-web';
import { LottieComponent, AnimationOptions, LottieDirective } from 'ngx-lottie';

@Component({
  selector: 'app-test',
  imports: [LottieComponent],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {

  options: AnimationOptions = {
    path: 'assets/animations/ramadan.json',
  };

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }

}
