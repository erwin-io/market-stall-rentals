import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, ResolveEnd, Router, RouterEvent } from '@angular/router';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { filter } from 'rxjs';


const titlePrefix = "SIATON MARKET STALL RENTALS";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = '';
  layout = 'main';
  loading = false;

  constructor(
    private titleService:Title,
    private spinner: SpinnerVisibilityService,
    private router: Router
    ) {
      this.setupTitleListener();
  }
  ngOnInit(): void {
  }
  private setupTitleListener() {
    this.router.events.pipe(filter(e => e instanceof ResolveEnd)).subscribe((e: any) => {
      const { data } = this.getDeepestChildSnapshot(e.state.root);
      if(data?.['title']){
        this.title = data['title'];
        this.layout = data['layout'];
        this.titleService.setTitle(`${titlePrefix} ${this.title}`);
      }
      this.navigationInterceptor(e);
    });
  }
  
  getDeepestChildSnapshot(snapshot: ActivatedRouteSnapshot) {
    let deepestChild = snapshot.firstChild;
    while (deepestChild?.firstChild) {
      deepestChild = deepestChild.firstChild
    };
    return deepestChild || snapshot
  }
  // Shows and hides the loading spinner during RouterEvent changes
  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.spinner.show();
    }
    if (event instanceof NavigationEnd) {
      this.spinner.hide();
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.spinner.hide();
    }
    if (event instanceof NavigationError) {
      this.spinner.hide();
    }
  }

  signOut() {
    localStorage.setItem("user", null);
    this.router.navigate(["signin"])
  }
}
