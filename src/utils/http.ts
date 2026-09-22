import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosProgressEvent
} from 'axios'
import qs from 'qs'
import router from '@/router/index'

type ProgressCallback = (percent: number, event: AxiosProgressEvent) => void

export type { AxiosProgressEvent, ProgressCallback }
export { qs }

/**
 * axios 二次封装的 HttpClient
 */
class HttpClient {
  private instance: AxiosInstance

  constructor(config: AxiosRequestConfig) {
    // 创建 axios 实例
    this.instance = axios.create(config)

    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        const authStore = useAuthStore()
        // 这里统一注入 token
        const token = authStore.token
        if (token) config.headers!.Authorization = token
        return config
      },
      (error) => Promise.reject(error)
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        if (response.data.code === 401) {
          router.replace({
            path: '/login',
            query: {
              redirect: router.currentRoute.value.fullPath
            }
          })
        } else if (response.data.code !== 200) {
          $message.error(response.data.message || '服务器错误')
        }
        // 统一只返回 data
        return response.data
      },
      (error) => {
        console.error('HTTP Error:', error)
        return Promise.reject(error)
      }
    )
  }

  /**
   * GET 请求
   */
  get<T>(
    url: string,
    params?: Record<string, ParamsType>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.instance.get(url, {
      params,
      ...config
    })
  }

  /**
   * POST 请求
   */
  post<T, D>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config)
  }

  /**
   * PUT 请求
   */
  put<T, D>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put(url, data, config)
  }

  /**
   * DELETE 请求
   */
  delete<T>(
    url: string,
    params?: Record<string, ParamsType>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.instance.delete(url, {
      params,
      ...config
    })
  }

  // 文件上传
  filePost<T, D>(
    url: string,
    data?: D,
    options?: {
      $onUploadProgress?: ProgressCallback
    } & AxiosRequestConfig
  ): Promise<T> {
    return this.instance.post(url, data, {
      ...options,
      timeout: 0,
      onUploadProgress: (e) => {
        if (!e.total) return
        const percent = Math.round((e.loaded / e.total) * 100)
        options?.$onUploadProgress?.(percent, e)
      }
    })
  }

  // 文件下载
  fileGet<T>(
    url: string,
    options?: {
      $onDownloadProgress?: ProgressCallback
    } & AxiosRequestConfig
  ): Promise<T> {
    return this.instance.get(url, {
      ...options,
      timeout: 0,
      onDownloadProgress: (e) => {
        if (!e.total) return
        const percent = Math.round((e.loaded / e.total) * 100)
        options?.$onDownloadProgress?.(percent, e)
      }
    })
  }
}

const baseConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_APP_API_BASE_URL || '/',
  timeout: 10000,
  paramsSerializer: (params): string => {
    return qs.stringify(params, {
      arrayFormat: 'repeat' // arr=1&arr=2
    })
  }
}

// 正常使用
export const fetchAxios = new HttpClient({ ...baseConfig, adapter: 'fetch' })

// 文件上传下载使用
export const fileAxios = new HttpClient({ ...baseConfig })
