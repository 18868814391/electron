import request from '@/utils/axios'

export function register(params) { return request({ url: '/login/register.php', method: 'post', data: params }) }// 注册
export function loginIN(params) { return request({ url: '/login/login.php', method: 'post', data: params }) }// 登陆
export function levelGet(params) { return request({ url: '/login/level.php', method: 'post', data: params }) }// 权限
export function UploadTxt(params) { return request({ url: '/upload/fileUpload.php', method: 'post', data: params }) }// 文件上传
export function getFile(params) { return request({ url: '/upload/getFile.php', method: 'post', data: params }) }// 文件下载
export function UploadRichTxt(params) { return request({ url: '/upload/richTxtUpload.php', method: 'post', data: params }) }// 富文本上传
export function BlogRichTxt(params) { return request({ url: '/upload/BlogRichTxt.php', method: 'post', data: params }) }// blog上传
export function BlogList(params) { return request({ url: '/upload/BlogList.php', method: 'post', data: params }) }// blog列表
export function blogDetail(params) { return request({ url: '/upload/BlogDetail.php', method: 'post', data: params }) }// blog详情
export function lightNovelList(params) { return request({ url: '/novel/lightNovelList.php', method: 'post', data: params }) }// 获取轻小说列表
export function getlightNovel(params) { return request({ url: '/novel/getNovel.php', method: 'post', data: params }) }// 获取轻小说内容
export function getheavyNovel(params) { return request({ url: '/novel/heavyNovelList.php', method: 'post', data: params }) }// 获取重小说章节
export function getMircleDetail(params) { return request({ url: '/novel/mircleDetail.php', method: 'post', data: params }) }// 获取重小说内容
export function getMusic(params) { return request({ url: '/media/music.php', method: 'post', data: params }) }// 获取音乐名字
export function getAnime(params) { return request({ url: '/media/anime.php', method: 'post', data: params }) }// 获取动画
export function sendFoot(params) { return request({ url: '/interaction/footprint.php', method: 'post', data: params }) }// 发送留言
export function getFoot(params) { return request({ url: '/interaction/footList.php', method: 'post', data: params }) }// 获取留言
export function yiiBlogAdd(params) { return request({ url: '/yii/web/index.php?r=blog/more', method: 'post', data: params }) }// yii新增博客
export function yiiBlogSearch(params) { return request({ url: '/yii/web/index.php?r=blog/search', method: 'post', data: params }) }// yii博客搜索
export function yiiRegister(params) { return request({ url: '/yii/web/index.php?r=user/register', method: 'post', data: params }) }// yii注册
export function yiiLogin(params) { return request({ url: '/yii/web/index.php?r=user/login', method: 'post', data: params }) }// yii登陆
export function yiiSocketIn(params) { return request({ url: '/yii/web/index.php?r=socketdata/addmessage', method: 'post', data: params }) }// yii socket消息存入
export function yiiSocketmsg(params) { return request({ url: '/yii/web/index.php?r=socketdata/getmessage', method: 'post', data: params }) }// yii socket消息历史
export function yiiMad(params) { return request({ url: '/yii/web/index.php?r=common/getmad', method: 'post', data: params }) }// yii 获取MAD
export function yiiBlogTab(params) { return request({ url: '/yii/web/index.php?r=blog/tabs', method: 'post', data: params }) }// yii 获取blog标签数
export function yiiSaveDood(params) { return request({ url: '/yii/web/index.php?r=common/savedood', method: 'post', data: params }) }// yii 涂鸦保存
export function yiiGetDood(params) { return request({ url: '/yii/web/index.php?r=common/getdood', method: 'post', data: params }) }// yii 获取涂鸦
export function wxsign(params) { return request({ url: '/wechat/access.php', method: 'post', data: params }) }// 微信签名
// http://www.shenyifan.top/apis/syf/php/wechat/access.php
