import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SalesOrderService } from '../../../services/sales_order/sales-order.service'; // use sales order service
import { ContactsService } from '../../../services/contacts/contacts.service';
import { UserManagementService } from '../../../services/user_management/user-management.service';
import { LoadingService } from '../../../services/loading/loading.service';
import { ToastMessageService } from '../../../services/toast_message/toast-message.service';

@Component({
    selector: 'app-add-sales-order',
    templateUrl: './add.component.html',
})
export class AddSaleOrderComponent implements OnInit{
    statusNames: string[] = ['Created', 'Approved', 'Delivered', 'Canceled'];
    saleOrderFormInfo : FormGroup; // typescript variable declaration
    contacts : Object;
    users : Object;
    submitted = false;
    sucessMessage: string = 'Success to add a new sale order!';
    errorMessage: string = 'Failed to add a new sale order!';

    constructor(protected router : Router,
                protected salesOrderService: SalesOrderService,
                private contactService : ContactsService,
                private userService : UserManagementService,
                private loadingService: LoadingService,
                private toastMessage: ToastMessageService){}

    ngOnInit(){
        this.saleOrderFormInfo = this.salesOrderService.initSaleOrder();
        // get list of contacts name from database and display them to the Contact name field in saleOrderForm
        this.contactService
            .getContacts()
            .subscribe((data) => {
                this.contacts = data.map((value) => {
                    return {contactId : value._id,
                            contactName: value.contactName};
                });
            });
        
        // get list of users from database and display them to the Assigned field in saleOrderForm
        this.userService
            .getUsers()
            .subscribe((data) => {
                this.users = data.map((value) => {
                    return {userId: value._id,
                            name: value.name};
                });
            });
    }

    get saleOrderFormControl(){
        return this.saleOrderFormInfo.controls;
    }

    // function to handle upload data from Sale order form to server
    onSubmit(form: FormGroup){
        this.submitted = true;
        let saleOrderInfo = form.value;
        saleOrderInfo.createdTime = new Date();
        saleOrderInfo.updatedTime = new Date();

        this.loadingService.showLoading();
        this.salesOrderService
            .addSaleOrder(saleOrderInfo)
            .subscribe((res) => {
                this.loadingService.hideLoading();
                if(res['status'] == 1){ // status = 1 => OK
                    // show successful message
                    // display the snackbar belong with the indicator
                    this.toastMessage.showInfo(this.sucessMessage);
                    this.router.navigate(['/sales_order']); // go back to the sales order page
                }
                else {
                    // show error message
                    this.toastMessage.showError(this.errorMessage);
                }
            });
    }
}