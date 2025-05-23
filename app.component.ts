import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Permissions } from '@capacitor/permissions';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  constructor(private platform: Platform) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();
    await Permissions.requestPermission({ name: 'microphone' });
  }
}
