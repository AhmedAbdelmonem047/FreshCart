import { CommonModule, isPlatformBrowser, NgIf } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import moment from 'moment-hijri';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';

@Component({
  selector: 'app-lottie-animations',
  imports: [CommonModule, LottieComponent, NgIf],
  templateUrl: './lottie-animations.component.html',
  styleUrl: './lottie-animations.component.scss'
})
export class LottieAnimationsComponent {

  isBrowser!: boolean;
  isVisible: boolean = true;
  
  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      const hijriMonth = moment().iMonth() + 1;
      const hasSeenAnimation = sessionStorage.getItem('hasSeenAnimation');

      if (!hasSeenAnimation && hijriMonth === 9)
        sessionStorage.setItem('hasSeenAnimation', 'true');
      else
        this.isVisible = false;

      setTimeout(() => {
        this.isVisible = false;
      }, 3000);
    }
  }


  options: AnimationOptions = {
    path: 'assets/animations/ramadan.json',
    loop: false,
  };
}
