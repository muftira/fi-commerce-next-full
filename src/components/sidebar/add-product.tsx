import React, { useState, useEffect } from 'react';

// component
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Asterisk from '@/components/asterisk';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Select from 'react-select';
import { MdOutlineAddPhotoAlternate } from 'react-icons/md';
import { Trash2, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Modal from '@/components/modal';

// Data
import { CategoryOptions, VariantsOptions, ColorOptions, SizeOptions } from '@/utils/data';

// type
import {
  VariantsData,
  OptionVariants,
  OptionSelected,
  RequestProduct,
  Variant,
  Value,
} from '@/types';

export default function addproduct() {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [variants, setVariants] = useState<VariantsData[]>([]);
  const [optionVariant, setOptionVariant] = useState<OptionVariants[]>(VariantsOptions);
  const [optionSelected, setOptionSelected] = useState<OptionSelected[]>([
    { option: [] },
    { option: [] },
  ]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [typeModal, setTypeModal] = useState<string>('');

  const [data, setData] = useState<RequestProduct>({
    productName: '',
    imageProduct: null,
    categoryName: '',
    description: '',
    status: 'DRAFT',
    sku: '',
    options: [],
    variants: [],
  });

  let lastColor: string | null | undefined = null;

  const handleChangePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    let files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/jpg') {
        setTypeModal('notImage');
        setIsModalOpen(true);
        files = null;
        return;
      }
    });

    if (files !== null) {
      if (images.length + files.length > 3) {
        setTypeModal('maxImage');
        setIsModalOpen(true);
        return;
      }

      const selectedFiles = Array.from(files).slice(0, 3);
      setImages(selectedFiles);
      let DataImages = [...images];
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          DataImages.push(file);
        });
      }
      setImages(DataImages);
      const previewUrls = DataImages.map((file) => URL.createObjectURL(file));
      setPreviews(previewUrls);
      setData((prev) => ({ ...prev, imageProduct: DataImages }));
    }
  };

  const handleDeletePhoto = (index: number) => {
    const _images = images.filter((_, i) => i !== index);
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setImages(_images);
    setData((prev) => ({ ...prev, imageProduct: _images }));
  };

  const handleAddVariant = (): void => {
    if (variants.length == 2) {
      return;
    }
    const dataVariant = [...variants, { variant: '', option: [] }];
    const newVariant = {
      option1: '',
      option2: '',
      price: 0,
      quantity: 0,
      weight: '',
      discount: 0,
      sku: '',
    };

    setVariants(dataVariant);
    setData((prev) => ({
      ...prev,
      variants: data.options.length === 0 ? [newVariant] : [...prev.variants],
      sku: '',
    }));
  };

  const handleDeleteVariant = (
    index: number,
    value: string | undefined,
    option: String[]
  ): void => {
    const updatedOptionVariant = optionVariant.map((variant) => {
      if (variant.value === value) {
        return {
          ...variant,
          isSelected: false,
        };
      }
      return variant;
    });

    const updatedVariants = variants.filter((variant, i) => variant.variant !== value);
    const updatedOptionsTable = data.options.filter((_, i) => i !== index);
    const variantData: Variant[] = [];
    let variant = {
      option1: '',
      option2: '',
      price: 0,
      quantity: 0,
      weight: '',
      discount: 0,
      sku: '',
    };
    updatedOptionsTable.forEach((item) => {
      item.value.forEach((value) => {
        variant = {
          ...variant,
          option1: value.name,
        };

        variantData.push(variant);
      });
    });

    const isvariantData =
      updatedOptionsTable[0]?.value.length === 0 || updatedOptionsTable.length === 0
        ? [variant]
        : variantData;
    setOptionVariant(updatedOptionVariant);
    setVariants(updatedVariants);
    setData((prev) => ({
      ...prev,
      options: updatedOptionsTable,
      variants: isvariantData,
    }));
  };

  const handleChangeVariant = (index: number, e: OptionVariants | null): void => {
    if (!e) return;
    const isChecked = optionVariant.some((variant) => variant.isSelected);
    let data: OptionVariants[] = [];

    if (index === 0) {
      data = optionVariant.map((variant) => {
        return {
          ...variant,
          isSelected: variant.value === e.value,
        };
      });
    }

    if (index === 1) {
      data = optionVariant.map((variant) => {
        if (variant.value === e.value) {
          return {
            ...variant,
            isSelected: true,
          };
        }
        return variant;
      });
    }

    const newVariant = [...variants];
    newVariant[index] = { ...newVariant[index], variant: e.value };
    setVariants(newVariant);
    setOptionVariant(data);

    const dataOptionTable = { name: e.value, value: [] };
    setData((prev) => ({
      ...prev,
      options: index === 0 ? [dataOptionTable] : [...prev.options, dataOptionTable],
    }));
  };

  const handleFocus = (index: number) => {
    const isChecked = variants[index].variant === 'Color';

    const updated = [...optionSelected];
    updated[index] = { option: isChecked ? ColorOptions : SizeOptions };
    setOptionSelected(updated);
  };

  const handleChangeOption = (
    variant: String | undefined,
    index: number,
    e: OptionVariants[] | null
  ): void => {
    if (!e) return;

    let newOptions: string[] = [];
    e.map((option: { value: string }) => {
      newOptions.push(option.value);
    });

    const newOption = [...variants];
    newOption[index] = { ...newOption[index], option: newOptions };

    let lengthOptions: number[] = [];
    const isOptions = newOption.map((item: VariantsData) => {
      lengthOptions.push(item.option.length);
    });
    const isChecked = lengthOptions.every((length: number | void) => length === 0);

    let updatedNewOption: VariantsData[] = [];
    if (isChecked && e.length === 0) {
      updatedNewOption = newOption.filter((_, idx: number) => idx === 0);
      const selectedVariant = optionVariant.map((item, idx) => {
        return {
          ...item,
          isSelected: item.value === updatedNewOption[0].variant,
        };
      });
      setOptionVariant(selectedVariant);
      setVariants(updatedNewOption);
    } else {
      setVariants(newOption);
    }

    const dataVariant: Variant[] = [];
    const dataValue: Value[] = [];
    const valueOptions = variants.find(
      (item: VariantsData, i: number) => item.variant !== variant
    ) || { option: [''] };

    if (e.length === 0) {
      valueOptions?.option.forEach((item: string) => {
        const variant = {
          option1: item,
          option2: '',
          price: 0,
          quantity: 0,
          weight: '',
          discount: 0,
          sku: '',
        };
        dataVariant.push(variant);
      });
    } else {
      valueOptions?.option.forEach((item: string) => {
        e.forEach((data: OptionVariants) => {
          const variant = {
            option1: index === 0 ? data.value : item,
            option2: index === 1 ? data.value : item,
            price: 0,
            quantity: 0,
            weight: '',
            discount: 0,
            sku: '',
          };
          dataVariant.push(variant);
        });
      });
    }

    e.forEach((data: OptionVariants) => {
      const value = {
        name: data.value,
      };
      dataValue.push(value);
    });

    const colorOrder = variants && variants[0]?.option;
    const sizeOrder = variants && variants[1]?.option;
    const sortingVariant = dataVariant.sort((a: Variant, b: Variant) => {
      // --- 1. Perbandingan Tingkat Pertama (option1 / Color) ---
      // Logika ini akan mengelompokkan semua 'Red' bersama, dan semua 'Blue' bersama.
      if ((a.option1 || '') < (b.option1 || '')) {
        return -1; // a (misalnya 'Blue') datang sebelum b ('Red')
      }
      if ((a.option1 || '') > (b.option1 || '')) {
        return 1; // a ('Red') datang setelah b ('Blue')
      }

      // --- 2. Perbandingan Tingkat Kedua (option2 / Size) ---
      // Jika sampai di sini, berarti option1A === option1B (Warna sama).
      // Sekarang disort berdasarkan Size (option2).
      if ((a.option2 || '') < (b.option2 || '')) {
        return -1;
      }
      if ((a.option2 || '') > (b.option2 || '')) {
        return 1;
      }

      // 3. Jika kedua tingkatan sama
      return 0;
    });

    setData((prev) => {
      const newOptions = [...prev.options];
      if (isChecked && e.length === 0) {
        const updatedNewOptions = newOptions
          .filter((data, idx) => data.name === updatedNewOption[0].variant)
          .map((item, idx) => {
            return {
              ...item,
              value: [],
            };
          });
        const variant = {
          option1: '',
          option2: '',
          price: 0,
          quantity: 0,
          weight: '',
          discount: 0,
          sku: '',
        };
        return { ...prev, options: updatedNewOptions, variants: [variant] };
      } else {
        newOptions[index] = {
          ...prev.options[index],
          value: dataValue,
        };
        return { ...prev, options: newOptions, variants: sortingVariant };
      }
    });
  };

  const handleOptionVariant = () => {
    const option = optionVariant
      .filter((opt) => !opt.isSelected)
      .map((opt) => {
        return {
          value: opt.value,
          label: opt.label,
          isSelected: false,
        };
      });
    return option;
  };

  const handleChangeNoVariants = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setData((prev) => {
      const newVariant = [...prev.variants];
      newVariant[0] = { ...newVariant[0], [field]: field === 'sku' || field === 'weight' ? e.target.value : Number(e.target.value), option1: '', option2: '' };
      return {
        ...prev,
        variants: newVariant,
        sku: field === 'sku' ? e.target.value : prev.sku,
      };
    });
  };

  const handleInputChange = (
    index: number,
    field: String,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setData((prev) => {
      const newVariants = [...prev.variants];
      newVariants[index] = { ...newVariants[index], [field as string]: field === 'sku' || field === 'weight' ? e.target.value : Number(e.target.value) };
      return { ...prev, variants: newVariants };
    });
  };

  useEffect(() => {
    console.log('data==> ', data);
  }, [data]);

  return (
    <div className="p-4">
      <p className="text-4xl font-bold mb-10">Add Your Product</p>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-3 items-center">
          <Label className="font-bold col-span-1" htmlFor="product's name">
            Product's Name <Asterisk />
          </Label>
          <Input
            value={data.productName}
            className="col-span-2"
            onChange={(e) => setData((prevData) => ({ ...prevData, productName: e.target.value }))}
            id="product's name"
            placeholder="Product's Name"
          />
        </div>
        <div className="grid grid-cols-3 items-center">
          <Label className="font-bold col-span-1" htmlFor="Category">
            Category <Asterisk />
          </Label>
          <Select
            value={
              data.categoryName ? { value: data.categoryName, label: data.categoryName } : null
            }
            className="col-span-2"
            options={CategoryOptions}
            onChange={(e) => {
              if (e?.value) {
                setData((prevData) => ({ ...prevData, categoryName: e.value }));
              }
            }}
          />
        </div>
        <div className="grid grid-cols-3">
          <Label className="font-bold mt-5" htmlFor="photoProduct">
            Photo Product <Asterisk />
          </Label>
          <div className="col-span-2">
            <div className="flex gap-2 mt-4">
              {previews.map((src, index) => (
                <div className="relative">
                  <img
                    className="w-24 h-24 object-cover border rounded-md"
                    key={index}
                    src={src}
                    alt={`Preview ${index + 1}`}
                  />
                  <X
                    className="absolute cursor-pointer top-[-5px] right-[-5px] w-[16px] h-[16px] bg-red-500 rounded-full hover:bg-red-800 text-white p-[2px]"
                    onClick={() => handleDeletePhoto(index)}
                  />
                </div>
              ))}
              <div className="relative">
                <div className="flex flex-col justify-center items-center gap-3 w-24 h-24 cursor-pointer border border-dashed border-gray-400 rounded-md absolute top-0">
                  <MdOutlineAddPhotoAlternate className="text-4xl" />
                  <p className="text-[10px]">{`Add Photo (${images.length}/3)`}</p>
                </div>
                <input
                  className="w-24 h-24 cursor-pointer opacity-0"
                  type="file"
                  accept="image/png, image/jpeg"
                  multiple
                  onChange={handleChangePhoto}
                />
                <Modal
                  className="hidden"
                  isModalOpen={isModalOpen}
                  onClick={() => setIsModalOpen(false)}
                  text={
                    typeModal == 'notImage'
                      ? {
                        title: 'Warning!',
                        description: 'Only JPEG, JPG and PNG images are allowed',
                        button: '',
                      }
                      : {
                        title: 'Warning!',
                        description: 'You can only upload up to 3 images.',
                        button: '',
                      }
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3">
          <Label className="font-bold" htmlFor="Description">
            Description <Asterisk />
          </Label>
          <Textarea
            value={data.description}
            className="col-span-2 h-[200px]"
            onChange={(e) => setData((prevData) => ({ ...prevData, description: e.target.value }))}
            id="Description"
            placeholder="Description"
          />
        </div>
        {variants.length === 0 && (
          <div className="grid grid-cols-3 items-center">
            <div>
              <Label className="font-bold" htmlFor="variant">
                Product's Variant
              </Label>
              <p className="text-sm">
                Add up to 2 variant types to let customers choose the product that suits them best.
              </p>
            </div>
            <Button onClick={() => handleAddVariant()} className="w-[100px]">
              {' '}
              + Add Variant
            </Button>
          </div>
        )}
        {variants.length > 0 && (
          <div className="flex flex-col w-full gap-6">
            {variants.map((variant, index) => (
              <div key={index} className="flex flex-row w-full justify-start items-center gap-6">
                <div className="flex flex-row w-full gap-6">
                  <div className="grid grid-cols-4 gap-6">
                    <Label className="font-bold self-center" htmlFor={`variant${index}`}>
                      Variant {index + 1} <Asterisk />
                    </Label>
                    <Select
                      value={
                        variant.variant
                          ? { value: variant.variant, label: variant.variant, isSelected: true }
                          : { value: '', label: 'Select...' }
                      }
                      name="variant"
                      options={handleOptionVariant()}
                      className="basic-single col-span-3"
                      onChange={(e) => handleChangeVariant(index, e)}
                      isDisabled={variant.option.length > 0 || variants[1]?.option.length > 0}
                    />
                  </div>
                  <div className="grid grid-cols-5 gap-6">
                    <Label className="font-bold self-center" htmlFor={`variant${index}`}>
                      Option {index + 1} <Asterisk />
                    </Label>
                    <Select
                      isMulti
                      name="option"
                      value={
                        data.options[index]?.value?.map((item) => ({
                          value: item.name,
                          label: item.name,
                        })) || []
                      }
                      options={optionSelected && optionSelected[index].option}
                      className="basic-multi-select col-span-3"
                      onChange={(e) => handleChangeOption(variant.variant, index, Array.from(e))}
                      onFocus={() => handleFocus(index)}
                      isDisabled={!variants[index].variant}
                    />
                    <Button
                      variant="outline"
                      onClick={() => handleDeleteVariant(index, variant.variant, variant.option)}
                      className="w-[50px]"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {variants.length < 2 && (
              <Button
                onClick={() => handleAddVariant()}
                className="w-[150px]"
                disabled={!variants[0].option.length}
              >
                {' '}
                + Add Variant
              </Button>
            )}
          </div>
        )}
        {variants.length > 0 && (
          <Table>
            {data.variants.length == 0 && (
              <TableCaption>A list of your recent Variants.</TableCaption>
            )}
            {/* Header Tabel */}
            <TableHeader>
              <TableRow>
                <>
                  <TableHead>{data?.options[0]?.name || 'Variant 1'}</TableHead>
                  {variants[1] && <TableHead>{data?.options[1]?.name || 'Variant 2'}</TableHead>}
                  <TableHead>Price (IDR)</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Weight (gram)</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>SKU</TableHead>
                </>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.variants.map((variant, index) => {
                const isNewColorGroup = variant.option1 !== lastColor;

                let rowSpan = 0;

                if (isNewColorGroup) {
                  rowSpan = data.variants.filter((v) => v.option1 === variant.option1).length;
                  lastColor = variant.option1;
                }

                return (
                  <TableRow key={index}>
                    {isNewColorGroup && <TableCell rowSpan={rowSpan}>{variant.option1}</TableCell>}
                    {variants[1] && <TableCell>{variant.option2}</TableCell>}
                    <TableCell>
                      <Input
                        className="w-[80px]"
                        type="number"
                        value={variant.price || ''}
                        onChange={(e) => handleInputChange(index, 'price', e)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        className="w-[80px]"
                        type="number"
                        value={variant.quantity || ''}
                        onChange={(e) => handleInputChange(index, 'quantity', e)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        className="w-[80px]"
                        type="number"
                        value={variant.weight?.toString() || ''}
                        onChange={(e) => handleInputChange(index, 'weight', e)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        className="w-[80px]"
                        type="number"
                        value={variant.discount || ''}
                        onChange={(e) => handleInputChange(index, 'discount', e)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        className="w-[80px]"
                        type="text"
                        value={variant.sku || ''}
                        onChange={(e) => handleInputChange(index, 'sku', e)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
        {variants.length === 0 && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-3 items-center">
              <Label className="font-bold" htmlFor="Price">
                Price <Asterisk />
              </Label>
              <Input
                value={data.variants[0]?.price || ''}
                type="number"
                className="col-span-2"
                onChange={(e) => handleChangeNoVariants(e, 'price')}
                id="Price"
                placeholder="IDR"
              />
            </div>
            <div className="grid grid-cols-3 items-center">
              <Label className="font-bold" htmlFor="Quantity">
                Quantity <Asterisk />
              </Label>
              <Input
                value={data.variants[0]?.quantity || ''}
                type="number"
                className="col-span-2"
                onChange={(e) => handleChangeNoVariants(e, 'quantity')}
                id="Quantity"
                placeholder="Quantity"
              />
            </div>
            <div className="grid grid-cols-3 items-center">
              <Label className="font-bold" htmlFor="SKU">
                SKU <Asterisk />
              </Label>
              <Input
                value={data.variants[0]?.sku || ''}
                className="col-span-2"
                onChange={(e) => handleChangeNoVariants(e, 'sku')}
                id="SKU"
                placeholder="SKU"
              />
            </div>
            <div className="grid grid-cols-3 items-center">
              <Label className="font-bold" htmlFor="Weight">
                Weight <Asterisk />
              </Label>
              <Input
                value={(data.variants[0]?.weight ?? '').toString() || ''}
                type="number"
                className="col-span-2"
                onChange={(e) => handleChangeNoVariants(e, 'weight')}
                id="Weight"
                placeholder="Grams"
              />
            </div>
            <div className="grid grid-cols-3 items-center">
              <Label className="font-bold" htmlFor="Discount">
                Discount
              </Label>
              <Input
                value={data.variants[0]?.discount || ''}
                type="number"
                className="col-span-2"
                onChange={(e) => handleChangeNoVariants(e, 'discount')}
                id="Discount"
                placeholder="IDR"
              />
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-end gap-4">
        <Button className="w-[120px] mt-10">Create Product</Button>
      </div>
    </div>
  );
}
