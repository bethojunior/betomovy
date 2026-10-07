<?php

namespace App\Models\Advertising;

use App\Models\Company\Company;
use App\Models\Enum\Gender;
use App\Models\Locale\City;
use App\Models\Platform\App;
use Illuminate\Database\Eloquent\Model;

class Advertising extends Model
{
    protected $table = 'advertising';

    protected $fillable = [
        'thumbnail',
        'banner',
        'description',
        'companyId',
        'dateStart',
        'dateEnd',
        'amountOfTime',
        'genderId',
        'advertisingAppSiteId',
        'cityId',
        'appId',
        'link',
        'emailRedirect',
        'emailInformation',
    ];

    /**
     * @return string
     */
    public function getThumbnailAttribute()
    {
        return \Storage::cloud()->url($this->attributes['thumbnail']);
    }

    /**
     * @return string
     */
    public function getBannerAttribute()
    {
        return \Storage::cloud()->url($this->attributes['banner']);
    }

    public function city()
    {
        return $this->belongsTo(City::class, 'cityId');
    }

    public function company()
    {
        return $this->belongsTo(Company::class, 'companyId');
    }

    public function gender()
    {
        return $this->belongsTo(Gender::class, 'genderId');
    }

    public function advertisingAppSite()
    {
        return $this->belongsTo(AdvertisingAppSite::class, 'advertisingAppSiteId');
    }

    public function app()
    {
        return $this->belongsTo(App::class, 'appId');
    }
}
