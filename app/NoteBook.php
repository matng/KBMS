<?php
/**
 * Created by PhpStorm.
 * User: zhaoshuai
 * Date: 2016/6/3 0003
 * Time: 13:55
 */

namespace App;

use Illuminate\Database\Eloquent\Model;
class NoteBook extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'folders';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'folname', 'folpreid', 'grade', 'updatetime', 'uid'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden  = [];

}