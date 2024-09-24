/*
 * Public enum share
 */
export * from './enums/contract-status';
export * from './enums/accom-status';
export * from './enums/notice-status';
export * from './enums/type-config-notice';
export * from './enums/gender.enum';
export * from './enums/constant-value';

/*
 * Public API of share
 */
export * from './service/application/categories/unit.service';
export * from './service/application/categories/privilege.service';
export * from './service/application/categories/file.service';

export * from './service/application/task/project.service';
export * from './service/application/task/message-hub.service';
export * from './service/application/task/status-template.service';
export * from './service/application/task/user.service';
export * from './service/application/task/role.service';
export * from './service/application/task/feedback.service';
export * from './service/application/task/notification.service';

export * from './service/base/dialog.service';
export * from './service/base/setting.service';
export * from './service/base/destroy.service';
export * from './service/base/modal.service';
export * from './service/base/template.service';

export * from './service/application/categories/label.service';
export * from './service/application/categories/utility.service';
export * from './service/application/categories/gender.service';
export * from './service/application/categories/diaban.service';
export * from './service/application/categories/nationality.service';
export * from './service/application/categories/country.service';
export * from './service/application/categories/identity-type.service';
export * from './service/application/categories/address-type.service';
export * from './service/application/categories/occupation.service';
export * from './service/application/categories/business-type.service';
export * from './service/application/categories/accom-types.service';
export * from './service/application/categories/scale-type.service';
export * from './service/application/categories/don-vi.service';
export * from './service/application/categories/config-noti-stay.service';

export * from './service/application/accom/contract-resident.service';
export * from './service/application/accom/contract-service.service';
export * from './service/application/accom/contract.service';
export * from './service/application/accom/residents.service';
export * from './service/application/accom/staying-reason.service';
export * from './service/application/accom/accommodation-facility.service';
export * from './service/application/accom/service-category.service';
export * from './service/application/accom/service.service';
export * from './service/application/accom/accommodations-utilities.service';
export * from './service/application/accom/accommodations.service';
export * from './service/application/accom/qr-code.service';
export * from './service/application/accom/regis-accom-facility.service';
export * from './service/application/accom/regis-accom-representative.service';
export * from './service/application/accom/regis-governing-body.service';
export * from './service/application/accom/accommodation-user.service';
export * from './service/application/accom/contract-accom.service';
export * from './service/application/accom/service-label.service';
export * from './service/application/accom/resident-timeline.service';
export * from './service/application/accom/noti-stay.service';
export * from './service/application/accom/notification-stay-customer-accom.service';
export * from './service/application/accom/formula.service';
export * from './service/application/accom/service-detail.service';
export * from './service/application/system/log-error.service';
export * from './service/application/accom/import-noti-stay.service';
export * from './service/application/accom/import-noti-stay-data.servicets';
export * from './service/application/accom/report.service';
export * from './service/application/accom/shr-contract.service';

export * from './service/application/accom/shr-api-noti-stay.service';
export * from './service/application/accom/shr-api-noti-stay-data.service';
/*
 * Public Model of share
 */

export * from './model/dialog-model';
export * from './model/response-model';
export * from './model/table-config-model';
export * from './model/table-tree-config-model';
export * from './model/user-profile';

export * from './service/tokens/api-base-url.token';
export * from './service/tokens/file-base-url.token';
