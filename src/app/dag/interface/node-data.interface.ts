export interface NodeDataInterface {
  id: string
  status: 'default' | 'success' | 'failed' | 'running'
  label?: string
  incomeId?: string
  /**
   * 如果当前节点是被退回的节点，那么它也许会记录着发生退回的节点的incomeId
   */
  backIncomeId?: string

  [key: string]: any
}
