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
        v-model="listQuery.source"
        placeholder="来源"
        clearable
        class="filter-item"
        style="width: 108px"
      >
        <el-option
          v-for="item in sourceOptions"
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
      <el-table-column label="姓名" width="140">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column label="电话" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
     <el-table-column label="性别" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sex==1?'先生':'女士' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公司" align="center">
        <template slot-scope="scope">
          {{ scope.row.company }}
        </template>
      </el-table-column>
      <el-table-column label="渠道" align="center">
        <template slot-scope="scope">
          {{ scope.row.source }}
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
import { getWhiteList } from '@/api/table'
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = ['success', 'gray']
      return statusMap[status]
    }
  },
  data() {
    return {
      sourceOptions: [
        { label: '媒体', key: '媒体' },
        { label: '来宾', key: '来宾' }
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
        source: undefined,
        create_time: undefined,
        sort: undefined
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
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
      getWhiteList(this.listQuery).then((response) => {
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
.filter-container {
  // margin-top: 20px;
  margin-bottom: 20px;
  .filter-item {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
@media screen and (max-width: 1000px) {
  .filter-container {
    margin-bottom: 20px;

    .filter-item {
      margin-right: 10px;
      margin-bottom: 20px;
    }
  }
  .pagination-container {
    padding-left: 0;
  }
}

</style>
