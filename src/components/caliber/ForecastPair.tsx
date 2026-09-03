import { Tooltip } from './ui';
import { forecastHeadline, forecastTip, type Forecast } from '../../data/caliber/forecast';

/**
 * The money answer to "why should I spend the hour here", in the three places
 * Britton asked for it: beside the OSR gauge, on the Priority action card, and
 * inside the set-focus modal where the plan changes the prediction.
 *
 * A number and an icon. The explanation is real but it is not what Ellis is
 * scanning for, so it stays in the tooltip.
 */
export function ForecastPair({
  forecast,
  firstName,
  eyebrow,
  headline,
  tip,
  side = 'top',
}: {
  forecast: Forecast;
  firstName: string;
  eyebrow?: string;
  /** Override when the surface already frames the number (a plan, say). */
  headline?: string;
  tip?: string;
  side?: 'top' | 'bottom';
}) {
  return (
    <div className={`cal-forecast${forecast.material ? '' : ' cal-forecast--flat'}`}>
      {eyebrow ? <span className="cal-eyebrow">{eyebrow}</span> : null}
      <span className="cal-forecast__pair">
        <span className="cal-forecast__head cal-num">{headline ?? forecastHeadline(forecast)}</span>
        <Tooltip label={tip ?? forecastTip(forecast, firstName)} side={side} />
      </span>
    </div>
  );
}
