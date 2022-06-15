<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="输入姓名查询"
        style="width: 150px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.phone"
        placeholder="输入手机号查询"
        style="width: 150px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-select
        v-model="listQuery.checked"
        placeholder="是否签到"
        clearable
        class="filter-item"
        style="width: 108px"
      >
        <el-option
          v-for="item in checkedOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        style="margin-left: 0"
        @click="handleDownload"
      >
        导出Excel
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      row-key="id"
      highlight-current-row
      @sort-change="sortChange"
    >
      <el-table-column align="center" label="ID" width="75" sortable prop="id">
        <template slot-scope="scope">
          <!-- {{ scope.$index }} -->
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="100">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="电话" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column
        class-name="status-col"
        label="是否签到"
        width="130"
        align="center"
        sortable
        prop="checked"
      >
        <template slot-scope="scope">
          <!-- <el-tag :type="scope.row.checked | statusFilter">{{
            scope.row.checked ? '是' : '否'
          }}</el-tag> -->
          <el-switch
            v-model="scope.row.checked"
            active-text="是"
            inactive-text="否"
            :active-value="1"
            :inactive-value="0"
            @change="changeChecked(scope.row.checked, scope.row.id)"
          />
        </template>
      </el-table-column>
      <el-table-column label="地址" align="center">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="创建时间"
        width="200"
        sortable
        prop="create_time"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pagesize"
      @pagination="fetchData"
    />
  </div>
</template>

<script>
import { getList } from '@/api/table'
import Pagination from '@/components/Pagination'
import { checkUser } from '@/api/user'
export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      // const statusMap = {
      //   published: 'success',
      //   draft: 'gray',
      //   deleted: 'danger'
      // }
      const statusMap = ['success', 'gray']
      return statusMap[status]
    }
  },
  data() {
    return {
      checkedOptions: [
        { label: '未签到', key: '0' },
        { label: '已签到', key: '1' }
      ],
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        pagesize: 10,
        phone: undefined,
        name: undefined,
        checked: undefined,
        create_time: undefined,
        sort: '+id'
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    changeChecked(checked, id) {
      console.log(checked, id)
      this.listLoading = true
      checkUser({
        id: id,
        action: checked === 1 ? 'check' : 'uncheck'
      })
        .then((response) => {
          this.listLoading = false
        })
        .catch(() => {
          this.list.forEach((element) => {
            if (element.id === id) {
              element.checked = checked === 0 ? 1 : 0
            }
          })
          this.listLoading = false
        })
    },
    // 导出表格
    handleDownload() {
      window.location.href =
        'https://www.dalalapic.com/h5/2022invitation/api/public/index.php/api/v1/exportExcel'
    },
    // 排序变化
    sortChange(data) {
      const { prop, order } = data
      if (['id', 'checked', 'create_time'].includes(prop)) {
        this.sortByID(prop, order)
      }
    },
    sortByID(prop, order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+' + prop
      } else {
        this.listQuery.sort = '-' + prop
      }
      this.handleFilter()
    },
    // 处理filter变化
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    // 查询数据
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then((response) => {
        console.log(response)
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    }
  }
}
</script>
<style scoped lang="scss">
.filter-container{
  // margin-top: 20px;
  margin-bottom: 20px;
  .filter-item{
    margin-right: 10px;
  }
}
@media screen and (max-width: 1000px) { 
 .filter-container{
  margin-bottom: 20px;

  .filter-item{
    margin-right: 10px;
      margin-bottom: 20px;
  }
}
.pagination-container{
  padding-left: 0;
}
}
</style>