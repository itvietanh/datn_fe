import { NgModule } from '@angular/core';
import { DateFormatPipe } from './date-format.pipe';
import { DatetimeFormatPipe } from './datetime-format.pipe';
import { TextMorePipe } from './text-more.pipe';
import { ShowCountPagingPipe } from './show-count-paging.pipe';
import { StringToFileName } from './stringToFileName.pipe';
import { FirstTxtPipe } from './first-txt.pipe';
import { AbsPipe } from './abs.pipe';
import { SafeIframePipe } from './safe-iframe.pipe';
import { NumberFormatPipe } from './number-format.pipe';
import { MoneyFormatPipe } from './money-format.pipe';
import { DecodeUrlPipe } from './decode-url.pipe';
import { ParseJsonPipe } from './parse-json.pipe';
import { LabelValuePipe } from './label-value.pipe';
import { NumberRomanPipe } from './number-roman.pipe';
import { ToUpperPipe } from './to-upper.pipe';

@NgModule({
  declarations: [
    DateFormatPipe,
    DatetimeFormatPipe,
    // AutChildPipe,
    // CsTimeAgoPipe,
    TextMorePipe,
    StringToFileName,
    ShowCountPagingPipe,
    SafeIframePipe,
    FirstTxtPipe,
    AbsPipe,
    NumberFormatPipe,
    MoneyFormatPipe,
    DecodeUrlPipe,
    ParseJsonPipe,
    LabelValuePipe,
    NumberRomanPipe,
    ToUpperPipe
  ],
  exports: [
    DateFormatPipe,
    DatetimeFormatPipe,
    // AutChildPipe,
    // CsTimeAgoPipe,
    TextMorePipe,
    StringToFileName,
    ShowCountPagingPipe,
    SafeIframePipe,
    FirstTxtPipe,
    AbsPipe,
    NumberFormatPipe,
    MoneyFormatPipe,
    DecodeUrlPipe,
    ParseJsonPipe,
    LabelValuePipe,
    NumberRomanPipe,
    ToUpperPipe
  ],
})
export class PipeModule { }
