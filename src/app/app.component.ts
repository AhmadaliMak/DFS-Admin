import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  ngOnInit(): void {
  }

  ngOnDestroy(){
    window.onabort = function(){
      sessionStorage.clear();
    }
  }
}
