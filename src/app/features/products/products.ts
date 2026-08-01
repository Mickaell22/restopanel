import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { apiMessage } from '../../core/api-error';
import { Product } from '../../core/models';
import { ProductsService } from '../../core/products.service';

/**
 * Gestion de productos: tabla + un unico dialogo que sirve para crear y para
 * editar. Es el mismo formulario en los dos casos -- separarlos duplicaba las
 * validaciones para cambiar nada mas el titulo y el verbo HTTP.
 */
@Component({
  selector: 'app-products',
  imports: [
    CurrencyPipe,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    TagModule,
    SelectModule,
    InputTextModule,
    InputNumberModule,
    ToggleSwitchModule,
    IconFieldModule,
    InputIconModule,
    MessageModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './products.html',
  styleUrl: './products.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Products {
  private readonly api = inject(ProductsService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly toast = inject(MessageService);

  protected readonly products = rxResource({ stream: () => this.api.list() });
  protected readonly categories = rxResource({ stream: () => this.api.categories() });

  /** null = alta; con producto = edicion. Tambien titula el dialogo. */
  protected readonly editing = signal<Product | null>(null);
  protected readonly dialogOpen = signal(false);
  protected readonly saving = signal(false);

  protected readonly dialogTitle = computed(() =>
    this.editing() ? 'Editar producto' : 'Nuevo producto',
  );

  protected readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    // El backend exige positivo y como mucho 2 decimales; el input numerico se
    // encarga de los decimales y esto de que no entre un 0.
    price: [0, [Validators.required, Validators.min(0.01)]],
    categoryId: [null as string | null],
    active: [true],
  });

  protected invalid(control: 'name' | 'price'): boolean {
    const field = this.form.controls[control];
    return field.invalid && field.touched;
  }

  protected openCreate(): void {
    this.editing.set(null);
    this.form.reset({ name: '', price: 0, categoryId: null, active: true });
    this.dialogOpen.set(true);
  }

  protected openEdit(product: Product): void {
    this.editing.set(product);
    this.form.reset({
      name: product.name,
      price: product.price,
      categoryId: product.categoryId,
      active: product.active,
    });
    this.dialogOpen.set(true);
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue();
    const current = this.editing();
    this.saving.set(true);

    const request = current
      ? this.api.update(current.id, payload)
      : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogOpen.set(false);
        this.products.reload();
        this.toast.add({
          severity: 'success',
          summary: current ? 'Producto actualizado' : 'Producto creado',
        });
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.toast.add({
          severity: 'error',
          summary: 'No se pudo guardar',
          detail: apiMessage(error, 'Revisa los datos e intenta de nuevo.'),
        });
      },
    });
  }

  protected confirmRemove(product: Product): void {
    this.confirmation.confirm({
      header: 'Eliminar producto',
      message: `Se eliminara "${product.name}". No se puede deshacer.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => this.remove(product),
    });
  }

  private remove(product: Product): void {
    this.api.remove(product.id).subscribe({
      next: () => {
        this.products.reload();
        this.toast.add({ severity: 'success', summary: 'Producto eliminado' });
      },
      error: (error: unknown) => {
        // El caso tipico es 409: el producto ya figura en ventas y el backend
        // lo protege para no romper el historial. El mensaje viene de el.
        this.toast.add({
          severity: 'error',
          summary: 'No se pudo eliminar',
          detail: apiMessage(error),
          life: 6000,
        });
      },
    });
  }
}
