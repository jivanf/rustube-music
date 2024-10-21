import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TuiRoot } from '@taiga-ui/core';
import { LayoutComponent } from 'app/layout/layout.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, TuiRoot, LayoutComponent],
    templateUrl: './app.component.html',
})
export class AppComponent {}
