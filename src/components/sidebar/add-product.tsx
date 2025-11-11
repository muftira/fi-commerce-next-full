import React, { useRef, useState, useEffect } from 'react';

// component
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Asterisk from '@/components/asterisk';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Select, { SingleValue } from 'react-select';
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
  VariantTable,
  Variant,
  Option,
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
  const [variantTable, setVariantTable] = useState<VariantTable[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [typeModal, setTypeModal] = useState<string>('');

  const [data, setData] = useState<RequestProduct>({
    productName: '',
    imageProduct: null,
    categoryName: '',
    description: '',
    status: '',
    sku: '',
    options: [],
    variants: [],
  });

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
    setVariants(dataVariant);
    // const dataVariantTable = {
    //   option1: '',
    //   option2: '',
    //   price: 0,
    //   quantity: 0,
    //   weight: 0,
    //   discount: 0,
    //   sku: '',
    // };
    // const dataOptionTable = { name: '', value: [] };
    // setData((prev) => ({
    //   ...prev,
    //   options: [...prev.options, dataOptionTable],
    //   variants: [...prev.variants, dataVariantTable],
    // }));
    // const dataVariantTable = [...variantTable, { Variant: '', detailVariant: [{ name: '', price: 0, quantity: 0, weight: 0, discount: 0, sku: '', isDeleted: false }] }]
    // setVariantTable(dataVariantTable);
  };

  const handleDeleteVariant = (index: number, value: string, option: String[]): void => {
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
    const updatedVariantsTable = data.variants.filter((item) => {
      return !option.includes(item.option1 ?? '');
    });
    setOptionVariant(updatedOptionVariant);
    setVariants(updatedVariants);
    setData((prev) => ({
      ...prev,
      options: updatedOptionsTable,
      variants: updatedVariantsTable,
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
      options: [...prev.options, dataOptionTable],
    }));
  };

  const handleFocus = (index: number) => {
    const isChecked = variants[index].variant === 'Color';

    const updated = [...optionSelected];
    updated[index] = { option: isChecked ? ColorOptions : SizeOptions };
    setOptionSelected(updated);
  };

  const handleChangeOption = (index: number, e: OptionVariants[] | null): void => {
    if (!e) return;

    let newOptions: string[] = [];
    e.map((option: { value: string }) => {
      newOptions.push(option.value);
    });

    const newOption = [...variants];
    newOption[index] = { ...newOption[index], option: newOptions };
    setVariants(newOption);

    let dataVariantTable: Variant[] = [];
    let dataValueTable: Value[] = [];
    if (index === 0) {
      e.map((value: { value: string }) => {
        const VariantTable = {
          option1: value.value,
          option2: '',
          price: 0,
          quantity: 0,
          weight: 0,
          discount: 0,
          sku: '',
        };
        const _dataValue = {
          name: value.value,
        };

        dataValueTable.push(_dataValue);
        dataVariantTable.push(VariantTable);
      });

      setData((prev) => {
        const newOptions = [...prev.options];
        newOptions[index] = {
          ...prev.options[index],
          value: dataValueTable,
        };
        return { ...prev, options: newOptions, variants: dataVariantTable };
      });
      
    }
    console.log('value ==> ',e);
    let dataVariantTable2: Variant[] = [];
    data.variants.map((opt: Variant, i: number) => {
      e.map((option: { value: string }, j: number) => {
        const VariantTable = {
          option1: opt.option1,
          option2: option.value,
          price: 0,
          quantity: 0,
          weight: 0,
          discount: 0,
          sku: '',
        };
        dataVariantTable2.push(VariantTable);
      });
    });
    console.log('dataVariantTable2 ==> ',dataVariantTable2);

    // setData((prev) => ({
    //   ...prev,
    //   variants: dataVariantTable2,
    // }))
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
  const handleChangeNoVariants = (e: React.ChangeEvent<HTMLInputElement>, value: string) => {
    const variantData = {
      option1: '',
      option2: '',
      price: 0,
      quantity: 0,
      weight: 0,
      discount: 0,
      sku: '',
    };
    switch (value) {
      case 'price':
        const price: Variant[] = [{ ...variantData, price: Number(e.target.value) }];
        setData((prev) => ({ ...prev, variants: price }));
        break;

      case 'quantity':
        const quantity: Variant[] = [{ ...variantData, quantity: Number(e.target.value) }];
        setData((prev) => ({ ...prev, variants: quantity }));
        break;

      case 'weight':
        const weight: Variant[] = [{ ...variantData, weight: Number(e.target.value) }];
        setData((prev) => ({ ...prev, weivariantsht: weight }));
        break;

      case 'discount':
        const discount: Variant[] = [{ ...variantData, discount: Number(e.target.value) }];
        setData((prev) => ({ ...prev, variants: discount }));
        break;

      case 'sku':
        const sku: Variant[] = [{ ...variantData, sku: e.target.value }];
        setData((prev) => ({ ...prev, variants: sku, sku: e.target.value }));
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    // if (variants.length === 0) {
    //   setData((prevData) => ({
    //     ...prevData,
    //     variants: [],
    //   }));
    // }
    console.log('data==> ', data);
  }, [variants, data]);

  return (
    <div className="p-4">
      <p className="text-4xl font-bold mb-10">Add Your Product</p>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-3 items-center">
          <Label className="font-bold col-span-1" htmlFor="product's name">
            Product's Name <Asterisk />
          </Label>
          <Input
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
                    />
                  </div>
                  <div className="grid grid-cols-5 gap-6">
                    <Label className="font-bold self-center" htmlFor={`variant${index}`}>
                      Option {index + 1} <Asterisk />
                    </Label>
                    <Select
                      isMulti
                      name="option"
                      options={optionSelected && optionSelected[index].option}
                      className="basic-multi-select col-span-3"
                      onChange={(e) => handleChangeOption(index, Array.from(e))}
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
            {variants[0].option?.length == 0 && (
              <TableCaption>A list of your recent Variants.</TableCaption>
            )}
            <TableHeader>
              <TableRow>
                {variants[0] && <TableHead>{variants[0].variant || 'Variant 1'}</TableHead>}
                {variants[1] && (
                  <TableRow className="grid grid-cols-6">
                    <TableHead className="translate-y-3.5">
                      {variants[1].variant || 'Variant 2'}
                    </TableHead>
                    <TableHead className="translate-y-3.5">Price (IDR)</TableHead>
                    <TableHead className="translate-y-3.5">Quantity</TableHead>
                    <TableHead className="translate-y-3.5">Weight (gram)</TableHead>
                    <TableHead className="translate-y-3.5">Discount</TableHead>
                    <TableHead className="translate-y-3.5">SKU</TableHead>
                  </TableRow>
                )}
                {!variants[1] && (
                  <>
                    <TableHead>Price (IDR)</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Weight (gram)</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>SKU</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {variants[0].option?.map((opt1, index) => (
                <TableRow key={index}>
                  {variants[0] && <TableCell>{opt1}</TableCell>}
                  {variants[1] && variants[1].variant
                    ? variants[1].option.map((opt2, idx) => (
                        <TableRow className="grid grid-cols-6">
                          <TableCell className="self-center">{opt2 || ''}</TableCell>
                          <TableCell>
                            <Input className="w-[80px]" />
                          </TableCell>
                          <TableCell>
                            <Input className="w-[80px]" />
                          </TableCell>
                          <TableCell>
                            <Input className="w-[80px]" />
                          </TableCell>
                          <TableCell>
                            <Input className="w-[80px]" />
                          </TableCell>
                          <TableCell>
                            <Input className="w-[80px]" />
                          </TableCell>
                        </TableRow>
                      ))
                    : variants[1] && <TableCell></TableCell>}
                  {!variants[1] && (
                    <>
                      <TableCell>
                        <Input className="w-[80px]" />
                      </TableCell>
                      <TableCell>
                        <Input className="w-[80px]" />
                      </TableCell>
                      <TableCell>
                        <Input className="w-[80px]" />
                      </TableCell>
                      <TableCell>
                        <Input className="w-[80px]" />
                      </TableCell>
                      <TableCell>
                        <Input className="w-[80px]" />
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
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
